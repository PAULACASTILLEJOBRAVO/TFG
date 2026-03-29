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
  clicker: {
    admin: [
        'deviceCode', 'status', 'assignedToUserId',  
        'isActive', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'
      ]
  },
  question: {
    teacher: ['text', 'options', 'correctOption', 'explanation', 'difficulty', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'],
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
  session: {
    teacher: {
      active: ['questions', 'deviceIds'],
      paused: [],
      completed: ['status', 'deviceIds', 'questions', 'endTime'], 
      cancelled: [],
      archived: [],
    },
    admin: {
      active: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'],
      paused: [],
      completed: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'],
      cancelled: [],
      archived: []
    }  
  }
};

module.exports = { 
    editableFields 
};
