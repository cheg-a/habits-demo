import React, { useEffect, useState } from 'react';
import '../App.css';
import { getMonthlyDailyReports, getProfileSummaryData } from '../services/api';

// Material UI импорты
import {
  Cancel as CancelIcon,
  CheckCircleOutline as CheckIcon,
  Favorite as FavoriteIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Стилизованные компоненты
const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
  color: 'white'
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.8rem',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  borderRadius: '12px',
  overflow: 'hidden'
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center'
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '6px',
  padding: theme.spacing(2)
}));

const CalendarDay = styled(Box)(({ 
  theme, 
  isToday, 
  hasReport,
  missedReport
}) => ({
  aspectRatio: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  position: 'relative',
  fontWeight: isToday ? 600 : 400,
  border: isToday ? `2px solid ${theme.palette.primary.main}` : 'none',
  background: isToday 
    ? theme.palette.primary.light
    : hasReport 
      ? 'rgba(16, 185, 129, 0.1)'  // Light green
      : missedReport 
        ? 'rgba(239, 68, 68, 0.1)'  // Light red
        : '#f9f9f9',
  '&.empty': {
    background: 'transparent',
    border: 'none'
  }
}));

const WeekdayLabel = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  padding: theme.spacing(1, 0),
}));

// Компонент календаря для отображения отчетов
const MonthlyCalendar = ({ monthlyReports }) => {
  const [currentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    // Получаем первый день месяца
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Получаем последний день месяца
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Создаем массив дней месяца
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push(date);
    }
    
    setCalendarDays(days);
  }, [currentDate]);
  
  // Функция для проверки, есть ли отчет за день
  const hasReport = (day) => {
    return monthlyReports.some(report => {
      return parseInt(report.day, 10) === day;
    });
  };
  
  // Получаем день недели первого дня месяца (0 - воскресенье, 1 - понедельник)
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() || 7;
  
  // Получаем название текущего месяца с заглавной буквы
  const monthName = currentDate.toLocaleString('ru-RU', { month: 'long' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Проверка для состояния дня
  const isDayToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(date);
    cellDate.setHours(0, 0, 0, 0);
    return cellDate.getTime() === today.getTime();
  };
  
  const isDayPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(date);
    cellDate.setHours(0, 0, 0, 0);
    return cellDate < today;
  };

  return (
    <>
      <SectionTitle>
        <TodayIcon sx={{ mr: 1 }} color="primary" />
        <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
          {capitalizedMonth} {currentDate.getFullYear()}
        </Typography>
      </SectionTitle>
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {weekdays.map((day) => (
            <WeekdayLabel key={day}>{day}</WeekdayLabel>
          ))}
        </Box>
        
        <CalendarGrid>
          {/* Пустые ячейки для правильного выравнивания */}
          {Array.from({ length: firstDayOfWeek - 1 }).map((_, index) => (
            <CalendarDay key={`empty-${index}`} className="empty" />
          ))}
          
          {/* Дни месяца */}
          {calendarDays.map((date) => {
            const isToday = isDayToday(date);
            const isPast = isDayPast(date);
            const hasReportForDay = hasReport(date.getDate());
            const isMissed = isPast && !isToday && !hasReportForDay;
            
            return (
              <Tooltip 
                key={date.getDate()} 
                title={
                  hasReportForDay 
                    ? "Отчет заполнен" 
                    : isMissed 
                      ? "Отчет пропущен" 
                      : isToday 
                        ? "Сегодня" 
                        : ""
                } 
                arrow
              >
                <CalendarDay 
                  isToday={isToday} 
                  hasReport={hasReportForDay}
                  missedReport={isMissed}
                >
                  <Typography variant="body2">{date.getDate()}</Typography>
                  {hasReportForDay && (
                    <CheckIcon fontSize="small" color="success" sx={{ position: 'absolute', bottom: '2px', opacity: 0.5, fontSize: '1.60rem' }} />
                  )}
                  {isMissed && (
                    <CancelIcon fontSize="small" color="error" sx={{ position: 'absolute', bottom: '2px', opacity: 0.5, fontSize: '1.60rem' }} />
                  )}
                </CalendarDay>
              </Tooltip>
            );
          })}
        </CalendarGrid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon fontSize="small" color="success" sx={{ mr: 0.5, opacity: 0.5, fontSize: '1.60rem' }} />
            <Typography variant="body2">Отчет заполнен</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon fontSize="small" color="error" sx={{ mr: 0.5, opacity: 0.5, fontSize: '1.60rem' }} />
            <Typography variant="body2">Отчет пропущен</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Получаем данные профиля
        const data = await getProfileSummaryData();
        setProfileData(data);
        
        // Получаем текущий месяц и год
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1; // Месяцы в JS начинаются с 0
        const year = currentDate.getFullYear();
        
        // Получаем отчеты за текущий месяц
        const reports = await getMonthlyDailyReports(month, year);
        setMonthlyReports(reports);
      } catch (err) {
        setError(err.message || "Не удалось загрузить данные профиля.");
        console.error("Ошибка при загрузке данных профиля:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка данных профиля...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка: {error}
        </Alert>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Данные профиля не найдены.
        </Alert>
      </Container>
    );
  }

  const { questionnaireSummary, userName } = profileData;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ProfileHeader>
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'white', 
            color: 'primary.main',
            mr: 2,
            boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.2)'
          }}
        >
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box>
          <PageTitle variant="h4">
            Мой профиль
          </PageTitle>
          {userName && (
            <Typography variant="subtitle1">
              {userName}
            </Typography>
          )}
        </Box>
      </ProfileHeader>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {questionnaireSummary ? (
            <SectionCard>
              <SectionTitle>
                <FlagIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Основная информация
                </Typography>
              </SectionTitle>
              <CardContent>
                {questionnaireSummary.mainGoal && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Главная жизненная цель:
                    </Typography>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        borderLeft: 4,
                        borderColor: 'primary.main'
                      }}
                    >
                      <Typography variant="body1">{questionnaireSummary.mainGoal}</Typography>
                    </Paper>
                  </Box>
                )}

                {questionnaireSummary.values && questionnaireSummary.values.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                      <FavoriteIcon sx={{ mr: 1, fontSize: 20 }} />
                      Мои ценности:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {questionnaireSummary.values.map((value, index) => (
                        <Chip 
                          key={index}
                          label={value}
                          variant="outlined"
                          color="primary"
                          sx={{ borderRadius: '8px' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {questionnaireSummary.habitsToTrack && questionnaireSummary.habitsToTrack.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                      Привычки в работе:
                    </Typography>
                    <List disablePadding>
                      {questionnaireSummary.habitsToTrack.map((habit, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <Divider variant="inset" component="li" />}
                          <ListItem>
                            <ListItemIcon>
                              <CheckIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={habit} />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </SectionCard>
          ) : (
            <SectionCard>
              <SectionTitle>
                <FlagIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Основная информация
                </Typography>
              </SectionTitle>
              <CardContent>
                <Alert severity="info">
                  Данные анкеты не найдены или еще не заполнены.
                </Alert>
              </CardContent>
            </SectionCard>
          )}
        </Grid>

        <Grid item xs={12}>
          <SectionCard>
            <MonthlyCalendar monthlyReports={monthlyReports} />
          </SectionCard>
        </Grid>
      </Grid>

      <Box
        component="footer"
        sx={{
          mt: 4,
          pt: 2,
          pb: 2,
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
          color: 'text.secondary',
          fontSize: '0.875rem'
        }}
      >
        Дневник отслеживания привычек © {new Date().getFullYear()}
      </Box>
    </Container>
  );
};

export default ProfilePage;
