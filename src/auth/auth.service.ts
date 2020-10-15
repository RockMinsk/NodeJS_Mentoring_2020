import { serviceInfo } from "../utils/logger/decorators/service-info";
import { AuthInterface } from "./auth.interface";
import { Authentication } from "./auth.model";

export class AuthService {

    @serviceInfo
    async getUserToken(token: string): Promise<AuthInterface|null> {
        const item: Authentication | null = await Authentication.findOne({ where: { token: token }});
        return item ? item.get({ plain: true }) : null;
    }

    @serviceInfo
    async updateToken (id: string, token: string|null): Promise<AuthInterface|null> {
        let item: Authentication | null = await Authentication.findByPk(id);
        if (!item) {
            item = await Authentication.create({ user_id: id, token: token });
        } else {
            item.update({ token: token })
        }
        return item.get({ plain: true });
    }
}
