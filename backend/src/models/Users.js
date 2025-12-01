import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
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
User.hasMany(Task, { foreignKey: "id", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "id" });
export default Users;
