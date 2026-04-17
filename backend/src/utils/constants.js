// Editable fields by role
const editableFields = {
  user: {
    student: ['username', 'fullname', 'bio'],
    teacher: ['username', 'fullname', 'bio'],
    admin: [
        'username', 'fullname', 'bio', 'profilePicture', 'role', 'email',
        'lastLoginAt', 'lastLogoutAt', 'status'
      ]
  },
  clicker: {
    admin: [
        'deviceCode', 'status', 'assignedToUserId',  
      ]
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
      paused: [],
      completed: ['status', 'deviceIds', 'questions', 'endTime'], 
      cancelled: [],
      archived: [],
    },
    admin: {
      active: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status'],
      paused: [],
      completed: ['teacherId', 'deviceIds', 'quizId', 'questions', 'startTime', 'endTime', 'status'],
      cancelled: [],
      archived: []
    }  
  }
};

module.exports = { 
    editableFields 
};
