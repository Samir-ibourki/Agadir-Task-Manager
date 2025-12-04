import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Tasks from "./Tasks.js";
const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
Users.hasMany(Tasks, { foreignKey: "id", onDelete: "CASCADE" });
Tasks.belongsTo(Users, { foreignKey: "id" });
export default Users;
