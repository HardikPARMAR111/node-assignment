import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { FindOptionsWhere } from "typeorm";
interface GetUsersFilters {
  search?: string;
  country?: string;
}

export class AuthService {
  private userRepository = AppDataSource.getMongoRepository(User);

  // register
  async register(data: RegisterDto) {
    const { name, email, password, role, phone, city, country } = data;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      return { success: false, message: "User already exist" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Partial<User> = {
      name,
      email,
      password: hashedPassword,
      role: role as "ADMIN" | "STAFF",
    };
    if (phone) userData.phone = phone;
    if (city) userData.city = city;
    if (country) userData.country = country;

    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);

    return {
      success: true,
      message: "User registered successfully",
      data: user,
    };
  }

  // login
  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return { success: false, message: "User does not exist" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return { success: false, message: "Incorrect password" };

    const token = jwt.sign(
      { id: user._id.toHexString(), email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return {
      success: true,
      message: "Login successful",
      data: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    };
  }

  // list all users (admin only)
  async getAllUsers(requestingUser: any, filters: GetUsersFilters = {}) {
    if (!requestingUser || requestingUser.role !== "ADMIN") {
      return { success: false, message: "Access denied" };
    }

    try {
      const { search, country } = filters;

      const andConditions: any[] = [];

      // 1. Construct the SEARCH condition ($or: [name, email])
      if (search) {
        const regex = new RegExp(search, "i");

        const searchCondition = {
          $or: [{ name: regex } as any, { email: regex } as any],
        };
        andConditions.push(searchCondition);
      }

      // 2. Construct the FILTER condition (country)
      if (country) {
        // Use RegExp for case-insensitive country filtering
        const countryCondition = { country: new RegExp(country, "i") };
        andConditions.push(countryCondition);
      }

      // 3. Assemble the final WHERE object using $and
      let finalWhere: FindOptionsWhere<User> = {};

      if (andConditions.length > 0) {
        (finalWhere as any).$and = andConditions;
      }

      // 4. Execute the find query
      const users = await this.userRepository.find({
        where: finalWhere,
      });

      // Format response
      const formattedUsers = users.map((u) => ({
        id: u._id.toHexString(),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        city: u.city,
        country: u.country,
      }));

      return {
        success: true,
        message: "Users fetched successfully",
        data: formattedUsers,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      };
    }
  }

  // list user by id
  async getUserById(requestingUser: any, userId: string) {
    try {
      const objId = new ObjectId(userId);

      // staff can only access their own data
      if (requestingUser.role !== "ADMIN" && requestingUser.id !== userId) {
        return { success: false, message: "Access denied" };
      }

      const user = await this.userRepository.findOne({
        where: { _id: objId },
        select: ["_id", "name", "email", "role", "phone", "city", "country"],
      });

      if (!user) return { success: false, message: "User not found" };

      return {
        success: true,
        message: "User fetched successfully",
        data: { ...user, id: user._id.toHexString() },
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      };
    }
  }
}
