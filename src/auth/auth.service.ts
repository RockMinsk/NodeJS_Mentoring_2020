import { serviceInfo } from "../utils/logger/decorators/service-info";
import { AuthInterface } from "./auth.interface";
import { Authentication } from "./auth.model";

class AuthService {

    @serviceInfo
    async getTokenByUserId(id: string): Promise<string|null> {
        const item: Authentication | null = await Authentication.findOne({ where: { user_id: id }});
        return item ? item.get({ plain: true }).refresh_token : null;
    }

    @serviceInfo
    async updateToken (id: string, token: string|null): Promise<AuthInterface|null> {
        let item: Authentication | null = await Authentication.findByPk(id);
        if (!item) {
            item = await Authentication.create({ user_id: id, refresh_token: token });
        } else {
            item.update({ refresh_token: token })
        }
        return item.get({ plain: true });
    }

    @serviceInfo
    async delete (id: string): Promise<number|null> {
        const item: number | null = await Authentication.destroy({ where: { user_id: id }});
        return item;
    }
}

export const authService = new AuthService();
