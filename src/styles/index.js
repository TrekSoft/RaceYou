const fontWhite = '#fff';
const backgroundGrey = '#d9d9d9';
const premiumOrange = '#ffab40';

export const button = {
  width: '100%',
  height: 60,
  maxWidth: 250,
  backgroundColor: '#1485cc',
  borderRadius: 10,
  elevation: 5,
  alignSelf: 'center',
  justifyContent: 'center'
};

export const buttonLight = {
  ...button,
  backgroundColor: '#444'
};

export const buttonDisabled = {
  ...button,
  backgroundColor: '#19212A'
};

export const buttonText = {
  color: '#fff',
  fontSize: 20
}

export const countdown = {
  fontSize: 25,
  color: '#00ff00',
  marginTop: 10,
  alignSelf: 'center'
};

export const header = {
  fontSize: 25,
  color: fontWhite,
  marginBottom: 15
};

export const headerRank = {
  ...header,
  marginBottom: 5,
  fontSize: 20,
  textAlign: 'center'
}

export const headerRankContainer = {
   flex: 1,
   alignItems: 'center',
   paddingHorizontal: 10
}

export const headerCentered = {
  ...header,
  textAlign: 'center'
};

export const logo = {
  ...header,
  fontSize: 45,
  marginBottom: 10
}

export const listBox = {
  width: '100%',
  minHeight: 40,
  backgroundColor: backgroundGrey,
  borderColor: '#595959',
  borderWidth: 2,
  borderRadius: 5,
  paddingBottom: 10
};

export const listBoxDark = {
  ...listBox,
  backgroundColor: '#272727',
  borderColor: '#000'
}

export const listHeaderContainer = {
  marginTop: 50,
  width: '100%',
  justifyContent: 'flex-start',
  flexDirection: 'row'
};

export const listText = {
  textAlign: 'center',
  margin: 15
};

export const page = {
  flexGrow: 1,
  flexDirection: 'column',
  backgroundColor: '#9A0850',
  alignItems: 'center',
  paddingHorizontal: '10%',
  height: '100%'
};

export const pageLight = {
  ...page,
  backgroundColor: backgroundGrey
}

export const premium2Col = {
  backgroundColor: premiumOrange,
  flex: 4,
  marginHorizontal: 5,
  alignItems: 'center'
}

export const raceHeader = {
  width: '100%',
  height: 100,
  backgroundColor: '#272727',
  flexDirection: 'row',
  alignItems: 'center'
};

export const raceHeaderDivider = {
  width: 2,
  height: '80%',
  backgroundColor: 'white'
};

export const raceHeaderSection = {
  flex: 1,
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center'
};

export const raceHeaderSubtext = {
  fontSize: 25,
  color: '#009900'
}

export const raceHeaderText = {
  fontSize: 35,
  color: '#00ff00'
}

export const tableHeading = {
  fontWeight: 'bold',
  flex: 2
}

export const radioLabels = {
  color: fontWhite,
  fontSize: 20,
  marginBottom: 3
}

export const tableCell = {
  flex: 2
}

export const tableRow = {
  flexDirection: 'row',
  marginBottom: 5
}

export const verticalTop = {
  justifyContent: 'flex-start'
};

export const verticalCenter = {
  justifyContent: 'center'
};

export const whiteText = {
  color: fontWhite,
  fontSize: 25
}
