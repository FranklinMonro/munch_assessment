import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface invoicesAttributes {
  id: string;
  fk_user_id: string;
  items?: object;
  pdf?: any;
  pdf_path?: string;
  invoice_date: Date;
}

export type invoicesPk = "id";
export type invoicesId = invoices[invoicesPk];
export type invoicesOptionalAttributes = "items" | "pdf" | "pdf_path" | "invoice_date";
export type invoicesCreationAttributes = Optional<invoicesAttributes, invoicesOptionalAttributes>;

export class invoices extends Model<invoicesAttributes, invoicesCreationAttributes> implements invoicesAttributes {
  id!: string;
  fk_user_id!: string;
  items?: object;
  pdf?: any;
  pdf_path?: string;
  invoice_date!: Date;

  // invoices belongsTo users via fk_user_id
  fk_user!: users;
  getFk_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setFk_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createFk_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof invoices {
    return invoices.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    fk_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    pdf: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    pdf_path: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'invoices',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "invoices_idx_id",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "invoices_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
