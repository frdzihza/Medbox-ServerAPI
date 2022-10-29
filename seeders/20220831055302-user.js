'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        user_id: 1,
        name: 'admin1',
        email: 'admin1@mail.com',
        gender: 'Male',
        birthDate: new Date('10-17-2021 07:00:00'),
        phoneNumber: '3213212878',
        isAdmin: true,
        isVerified: true,
        password:
          '$2a$10$XB3xnB6q2icy.a1YG388ZO/eNWAo6AMR/O6.MUFpIJhpGwm0t1LP6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        name: 'user1',
        email: 'user1@mail.com',
        gender: 'Female',
        birthDate: new Date('10-11-2021 07:00:00'),
        phoneNumber: '3213212854',
        isAdmin: false,
        isVerified: true,
        password:
          '$2a$10$XB3xnB6q2icy.a1YG388ZO/eNWAo6AMR/O6.MUFpIJhpGwm0t1LP6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        name: 'user2',
        email: 'user2@mail.com',
        gender: 'Male',
        birthDate: new Date('10-27-2021 07:00:00'),
        phoneNumber: '9213212878',
        isAdmin: false,
        isVerified: true,
        password:
          '$2a$10$XB3xnB6q2icy.a1YG388ZO/eNWAo6AMR/O6.MUFpIJhpGwm0t1LP6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 4,
        name: 'Jamal Bismarckz',
        email: 'Bismarckz33@yahoo.com',
        gender: 'Male',
        birthDate: new Date('10-17-2021 07:00:00'),
        phoneNumber: '3213212832',
        isAdmin: false,
        isVerified: true,
        password:
          '$2a$10$XB3xnB6q2icy.a1YG388ZO/eNWAo6AMR/O6.MUFpIJhpGwm0t1LP6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
