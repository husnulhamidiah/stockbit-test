export default (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    reqTime: DataTypes.DATE,
    keyword: DataTypes.STRING,
    result: DataTypes.TEXT
  }, {})

  return Log
}
