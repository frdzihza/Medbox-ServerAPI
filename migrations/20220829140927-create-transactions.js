'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      transaction_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      prescriptionImage: {
        type: Sequelize.STRING(255),
      },
      prescriptionImage: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'address_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM(
          'awaiting_payment',
          'awaiting_payment_confirmation',
          'processing_order',
          'order_cancelled',
          'delivering_order',
          'order_confirmed',
        ),
        defaultValue: 'awaiting_payment',
      },

      courier: {
        type: Sequelize.STRING,
      },
      deliveryCost: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  },
};
