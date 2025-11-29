// Editable fields by role
const editableFields = {
  user: {
    student: ['username', 'fullname', 'bio'],
    teacher: ['username', 'fullname', 'bio'],
    admin: [
        'username', 'fullname', 'bio',
        'lastLogin',
        'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'
      ]
  },
  course: {},
  question: {},
  quiz: {},
  response: {},
  result: {},
  session: {}
};

module.exports = { 
    editableFields 
};
