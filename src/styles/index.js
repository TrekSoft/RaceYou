const fontWhite = '#fff';

export const button = {
  width: '100%',
  height: 60,
  maxWidth: 250,
  backgroundColor: '#8FD819',
  borderRadius: 10,
  elevation: 5,
  alignSelf: 'center',
  justifyContent: 'center'
};

export const buttonDisabled = {
  ...button,
  backgroundColor: '#19212A'
};

export const header = {
  fontSize: 25,
  color: fontWhite,
  marginBottom: 15
};

export const logo = {
  ...header,
  fontSize: 45,
  marginBottom: 10
}

export const listBox = {
  width: '100%',
  minHeight: 40,
  backgroundColor: '#d9d9d9ff',
  borderColor: '#595959',
  borderWidth: 2,
  borderRadius: 5,
  paddingBottom: 10
};

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

export const verticalTop = {
  justifyContent: 'flex-start'
};

export const verticalCenter = {
  justifyContent: 'center'
};

export const whiteText = {
  color: fontWhite
}
