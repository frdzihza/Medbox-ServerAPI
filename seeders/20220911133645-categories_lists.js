'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert('categories_lists', [
      {
        category_lists_id: 1,
        category: 'Flu & Batuk',
        categoryImage: '/public/categoriesImage/1.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 2,
        category: 'Asma',
        categoryImage: '/public/categoriesImage/2.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 3,
        category: 'Antibiotik',
        categoryImage: '/public/categoriesImage/3.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 4,
        category: 'Mata',
        categoryImage: '/public/categoriesImage/4.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 5,
        category: 'P3K',
        categoryImage: '/public/categoriesImage/5.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 6,
        category: 'Vitamin',
        categoryImage: '/public/categoriesImage/6.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 7,
        category: 'Pusing',
        categoryImage: '/public/categoriesImage/7.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 8,
        category: 'Pencernaan',
        categoryImage: '/public/categoriesImage/8.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_lists_id: 9,
        category: 'Minyak angin & Balsem',
        categoryImage: '/public/categoriesImage/9.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories_lists', null, {});
  },
};
