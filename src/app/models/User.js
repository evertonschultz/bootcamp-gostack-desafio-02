import Sequelize, { Model } from 'sequelize';
import brcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    // executa antes de qualquer Save, ou editar etc usuários
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await brcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Meetup);
    this.hasMany(models.Subscription);
  }

  checkPassword(password) {
    return brcrypt.compare(password, this.password_hash);
  }
}

export default User;