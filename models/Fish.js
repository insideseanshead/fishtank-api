module.exports = function(sequelize, DataTypes) {
    var Fish = sequelize.define('Fish', {
        name: DataTypes.STRING,
        width:DataTypes.INTEGER,
        color:DataTypes.STRING
    });

    Fish.associate = function(models) {
        Fish.belongsTo(models.Tank);
        Fish.belongsTo(models.User);
    }

    return Fish; 
}