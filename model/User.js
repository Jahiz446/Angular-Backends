const Sequelize = require('../util/db')

const { DataTypes, Model } = require('sequelize');

class User extends Model{}
User.init({
    id: {type:DataTypes.INTEGER , unique: true , allowNull: false, primaryKey: true,  autoIncrement: true},
    user_name: {type:DataTypes.STRING, allowNull: false},
    password:{type:DataTypes.STRING, allowNull: false},
    email:{type:DataTypes.STRING, allowNull: false},
    number:{type:DataTypes.INTEGER, allowNull: false},
    gender: {type:DataTypes.STRING, allowNull: false},
    image: {type:DataTypes.STRING},
},{
    modelName:'users',
    sequelize: Sequelize,
    tableName:'users',
    timestamps:false
})

module.exports = User