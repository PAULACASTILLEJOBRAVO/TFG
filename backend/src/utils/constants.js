// Editable fields by role
const editableFields = {
  user: {
    student: ['username', 'fullname', 'bio'],
    teacher: ['username', 'fullname', 'bio'],
    admin: [
        'username', 'fullname', 'bio', 'profilePicture', 'role', 'email',
        'lastLoginAt',
        'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'
      ]
  },
  // course: {},
  question: {
    teacher: ['text', 'options', 'correctOption', 'explanation', 'difficulty'],
    admin: ['text', 'options', 'correctOption', 'explanation', 'difficulty']
  },
  quiz: {
    teacher: [
      'title', 'description', 'creatorId', 'playerIds', 'questionIds', 'difficulty', 'status', 'isActive',
      'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'
    ],
    admin: [
      'title', 'description', 'creatorId', 'playerIds', 'questionIds', 'difficulty', 'status', 'isActive',
      'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'
    ]
  },
  response: {},
  result: {},
  session: {}
};

module.exports = { 
    editableFields 
};
