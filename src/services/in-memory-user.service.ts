import {User} from "@models/user";
import {UserService} from "@services/user.service";

export class InMemoryUserService implements UserService {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(u => u.email === email);
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    // Test utility method
    __test_reset(): void {
        this.users = [];
    }
}