import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface productsAttributes {
  id: string;
  name: string;
  price: number;
  description?: string;
  qty: number;
  upsells_lins?: string[];
  upsell_fk_id?: string;
  active: boolean;
  created_date: Date;
  updated_date: Date;
}

export type productsPk = "id";
export type productsId = products[productsPk];
export type productsOptionalAttributes = "price" | "description" | "qty" | "upsells_lins" | "upsell_fk_id" | "created_date" | "updated_date";
export type productsCreationAttributes = Optional<productsAttributes, productsOptionalAttributes>;

export class products extends Model<productsAttributes, productsCreationAttributes> implements productsAttributes {
  id!: string;
  name!: string;
  price!: number;
  description?: string;
  qty!: number;
  upsells_lins?: string[];
  upsell_fk_id?: string;
  active!: boolean;
  created_date!: Date;
  updated_date!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof products {
    return products.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0.00
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    qty: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    upsells_lins: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    upsell_fk_id: {
      type: DataTypes.UUID,
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
    }
  }, {
    sequelize,
    tableName: 'products',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "products_idx_id",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "products_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
