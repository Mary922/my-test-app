import Joi from '@hapi/joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ,\.\s\-]+$/)
    .messages({
      'string.empty': 'Имя обязательно для заполнения',
      'string.min': 'Имя должно содержать минимум 2 символа',
      'string.max': 'Имя должно содержать максимум 50 символов',
      'string.pattern.base': 'Имя может содержать только буквы, пробелы и дефисы',
      'any.required': 'Имя обязательно для заполнения'
    }),

  birthdate: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Дата рождения должна быть корректной датой',
      'date.max': 'Дата рождения не может быть в будущем',
      'any.required': 'Дата рождения обязательна для заполнения'
    }),

  email: Joi.string()
    .email()
    .required()
    .trim()
    .messages({
      'string.email': 'Введите корректный email адрес',
      'string.empty': 'Email обязателен для заполнения',
      'any.required': 'Email обязателен для заполнения'
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .pattern(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d)/)
    .messages({
      'string.empty': 'Пароль обязателен для заполнения',
      'string.min': 'Пароль должен содержать минимум 6 символов',
      'string.max': 'Пароль должен содержать максимум 30 символов',
      'string.pattern.base': 'Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру',
      'any.required': 'Пароль обязателен для заполнения'
    })
});

export const validateUserData = (data: any) => {
  const processedData = {
    ...data,
    name: data.name ? data.name.trim() : '',
    email: data.email ? data.email.toLowerCase().trim() : '',
    password: data.password ? data.password.trim() : '',
  };


  const { error, value } = registerSchema.validate(processedData, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      type: detail.type
    }));

    return {
      isValid: false,
      errors: errorMessages,
      validatedData: null
    };
  }

  return {
    isValid: true,
    errors: null,
    validatedData: {
      name: value.name.trim(),
      birthdate: value.birthdate,
      email: value.email.toLowerCase().trim(),
      password: value.password
    }
  };
};

export function testUserValidation(testData: any) {
  console.log('=== ТЕСТ ВАЛИДАЦИИ ===');
  console.log('Входные данные:', testData);

  const result = validateUserData(testData);

  if (result.isValid) {
    console.log('✅ Валидация успешна');
    console.log('Обработанные данные:', result.validatedData);
  } else {
    console.log('❌ Ошибки валидации:');
    result.errors?.forEach(error => {
      console.log(`  ${error.field}: ${error.message}`);
    });
  }

  console.log('=====================\n');
  return result;
};