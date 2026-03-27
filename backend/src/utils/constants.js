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
      paused: ['status', 'deviceIds', 'questions', 'endTime', 'status'],
      completed: ['status', 'deviceIds', 'questions', 'endTime'], 
      cancelled: ['status','questions', 'endTime'],
      archived: ['status']
    },
    admin: {
      active: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'],
      paused: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'],
      completed: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'],
      cancelled: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason'],
      archived: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteReason']
    }  
  }
};

module.exports = { 
    editableFields 
};
