import { AppDataSource } from "../config/database.js";
import { RoleEntity } from "../entities/role.js";

class RoleRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(RoleEntity);
  }

  async createRole(req, res) {
    const { roleName } = req.body;

    const findData = await this.repository.findOne({ where: { roleName } });

    if (findData) {
      return res.status(404).json({
        status: false,
        message: "Data role name already exist!",
      });
    }

    const create = this.repository.create({ roleName });

    await this.repository.save(create);

    return res.status(201).json({
      status: false,
      message: "Create role successfully",
    });
  }

  async getAllRoles(req, res) {
    const findData = await this.repository.find();

    if (!findData) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Get data successful",
      data: findData,
    });
  }

  async getRoleById(req, res) {
    const { id } = req.params;

    const findData = await this.repository.findOne({ where: { id } });

    if (!findData) {
      return res.status(404).json({
        status: false,
        message: "Data not found!",
      });
    }

    return;
  }

  async updateRole(req, res) {
    const { id } = req.params;
    const { roleName } = req.body;

    const findData = await this.repository.findOne({ where: { id } });

    if (!findData) {
      return res.status(404).json({
        status: false,
        message: "Data not found!",
      });
    }

    const updateData = await this.repository.update(id, { roleName });

    return res.status(200).json({
      status: true,
      message: "Data updated successfully",
      data: updateData,
    });
  }

  async deleteRole(req, res) {
    const { id } = req.params;

    const findData = await this.repository.findOne({ where: { id } });

    if (!findData) {
      return res.status(404).send("Role not found");
    }

    await this.repository.remove(findData);

    return res.status(200).json({
      status: true,
      message: "Role deleted successfully",
      data: findData,
    });
  }
}

export default RoleRepository;
