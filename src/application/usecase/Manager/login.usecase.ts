import ManagerRepositoryInterface from "../../repository/ManagerRepositoryInterface";
import Manager from "../../../domain/Manager";
import nodeSchedule from 'node-schedule';
import LogoutRepositoryInterface from "../../repository/LogoutRepositoryInterface";

export default class UsecaseLoginManager {
  constructor(readonly repo: ManagerRepositoryInterface, readonly repoLogout: LogoutRepositoryInterface) {}
  async execute(props: input): Promise<output> {
    const manager = Manager.create(props);
    const getManager = await this.repo.GetOne(props.name);
    const token = await manager.generateToken(getManager.id);
    if (manager.validPassword(getManager.password)) {
        const objectReturn = {
            token: token,
            name: getManager.name,
            type: getManager.type,
            id: getManager.id,
            organizationId: getManager.organizationId,
        };
        nodeSchedule.scheduleJob("0 0 * * 7", () => this.repoLogout.logout(token));
        return objectReturn;
    }}
}

export type input = {
    name: string,
    password: string,
};

export type output = {
    token: string,
    name: string,
    type: string,
    id: string,
    organizationId: string,
};