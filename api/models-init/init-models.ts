import type { Sequelize } from "sequelize";
import { invoices as _invoices } from "./invoices";
import type { invoicesAttributes, invoicesCreationAttributes } from "./invoices";
import { products as _products } from "./products";
import type { productsAttributes, productsCreationAttributes } from "./products";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _invoices as invoices,
  _products as products,
  _users as users,
};

export type {
  invoicesAttributes,
  invoicesCreationAttributes,
  productsAttributes,
  productsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const invoices = _invoices.initModel(sequelize);
  const products = _products.initModel(sequelize);
  const users = _users.initModel(sequelize);

  invoices.belongsTo(users, { as: "fk_user", foreignKey: "fk_user_id"});
  users.hasMany(invoices, { as: "invoices", foreignKey: "fk_user_id"});

  return {
    invoices: invoices,
    products: products,
    users: users,
  };
}
