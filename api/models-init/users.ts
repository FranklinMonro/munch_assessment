import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { invoices, invoicesId } from './invoices';

export interface usersAttributes {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  active: boolean;
  created_date: Date;
  updated_date: Date;
  role?: string;
  password: string;
}

export type usersPk = "id";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "name" | "surname" | "created_date" | "updated_date" | "role";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  id!: string;
  email!: string;
  name?: string;
  surname?: string;
  active!: boolean;
  created_date!: Date;
  updated_date!: Date;
  role?: string;
  password!: string;

  // users hasMany invoices via fk_user_id
  invoices!: invoices[];
  getInvoices!: Sequelize.HasManyGetAssociationsMixin<invoices>;
  setInvoices!: Sequelize.HasManySetAssociationsMixin<invoices, invoicesId>;
  addInvoice!: Sequelize.HasManyAddAssociationMixin<invoices, invoicesId>;
  addInvoices!: Sequelize.HasManyAddAssociationsMixin<invoices, invoicesId>;
  createInvoice!: Sequelize.HasManyCreateAssociationMixin<invoices>;
  removeInvoice!: Sequelize.HasManyRemoveAssociationMixin<invoices, invoicesId>;
  removeInvoices!: Sequelize.HasManyRemoveAssociationsMixin<invoices, invoicesId>;
  hasInvoice!: Sequelize.HasManyHasAssociationMixin<invoices, invoicesId>;
  hasInvoices!: Sequelize.HasManyHasAssociationsMixin<invoices, invoicesId>;
  countInvoices!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    surname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "users_idx_id",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
