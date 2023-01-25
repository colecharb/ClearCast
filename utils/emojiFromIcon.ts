

export default (icon: string) => {

  const code = icon.slice(0, 2);
  const dn = icon.slice(-1);
  const daytime = (dn === 'd');
  const nighttime = !daytime;
  let emoji = '';

  switch (code) {
    case '01':
      if (daytime) {
        emoji = '☀️';
        break;
      } else {
        emoji = '🌕';
        break;
      }
    case '02':
      if (daytime) {
        emoji = '🌤️';
        break;
      } else {
        emoji = '🌕';
        break;
      }
    case '03':
      if (daytime) {
        emoji = '🌥️';
        break;
      } else {
        emoji = '☁️';
        break;
      }
    case '04':
      emoji = '☁️';
      break;
    case '09':
      emoji = '🌧️';
      break;
    case '10':
      if (daytime) {
        emoji = '🌦️';
        break;
      } else {
        emoji = '🌧️';
        break;
      }
    case '11':
      // todo: there are options for this one
      emoji = '🌩️';
      break;
    case '13':
      // todo: there are options for this one too
      emoji = '❄️'
      break;
    case '50':
      // todo: this one sucks... is there an alternative?
      emoji = '🌫️'
      break;
    default:
      emoji = '??';
  }

  return emoji
}