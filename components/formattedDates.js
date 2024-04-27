const formattedDates = () => {
  const selectedDate = new Date();
  const month = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dec",
  ];
  const weekday = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const hour = selectedDate?.getHours();
  const minutes = selectedDate?.getMinutes();

  const dateDay = selectedDate?.getDate();
  const dateWeekDay = selectedDate?.getDay();
  const dateMonth = selectedDate?.getMonth();

  return {
    date: selectedDate,
    hour: `${hour < 10 ? "0" + hour : hour}:${
      minutes < 10 ? "0" + minutes : minutes
    }`,
    displayDate: `${weekday[dateWeekDay]}, ${dateDay} ${month[dateMonth]}`,
    calendarDate: `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`,
  };
};

export default formattedDates;
