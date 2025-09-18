import { testUserValidation } from "../middlewares/validation/validate-user";

// Тестовые данные
const testCases = [
  // Успешный случай
  {
    name: "John Doe",
    birthdate: "1990-01-01",
    email: "test@example.com",
    password: "Password123"
  },
  // С пробелами
  {
    name: "  John Doe  ",
    birthdate: "1990-01-01",
    email: "  TEST@EXAMPLE.COM  ",
    password: "Password123"
  },
  // Ошибочные данные
  {
    name: "J",
    birthdate: "2050-01-01",
    email: "invalid-email",
    password: "weak"
  }
];

// Запуск тестов
console.log('Запуск тестов валидации...\n');
testCases.forEach((testCase, index) => {
  console.log(`Тест #${index + 1}:`);
  testUserValidation(testCase);
});