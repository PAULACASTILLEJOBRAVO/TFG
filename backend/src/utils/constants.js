// Editable fields by role
const editableFields = {
  user: {
    student: ['username', 'fullname', 'email', 'password', 'bio'],
    teacher: ['username', 'fullname', 'email', 'password', 'bio'],
    admin: [
        'username', 'fullname', 'email', 'password', 'bio', 
        'role', 'isActive',  'lastLogin',
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
