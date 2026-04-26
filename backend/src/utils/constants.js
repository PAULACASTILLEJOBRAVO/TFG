// Editable fields by role
const editableFields = {
  user: {
    admin: ['username', 'fullname', 'profilePicture', 'role', 'email', 'lastLoginAt', 'lastLogoutAt', 'status']
  },
  clicker: {
    admin: ['deviceCode', 'status', 'assignedToUserId']
  },
  question: {
    teacher: ['text', 'options', 'correctOption', 'difficulty'],
  },
  quiz: {
    teacher: [
      'title', 'description', 'creatorId', 'playerIds', 'questionIds', 'difficulty', 'status'
    ],
    admin: [
      'title', 'description', 'creatorId', 'playerIds', 'questionIds', 'difficulty', 'status'
    ]
  },
  session: {
    teacher: {
      active: ['questions', 'deviceIds'],
      completed: ['status', 'deviceIds', 'questions', 'endTime'], 
    },
    admin: {
      active: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status'],
      completed: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status'],
    }  
  }
};

module.exports = { 
    editableFields 
};
