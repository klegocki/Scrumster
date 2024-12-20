
export default function UserInformation(props) {


  const paragraphStyle = {
    fontWeight: 'bold'
  };


  return (
    <div className="user-information-component">
      <div className="user-image">
        <img src="/static/frontend/userImage.svg" alt="userImage" />
      </div>
      <div className="user-info">
        <p style={paragraphStyle}>Nazwa użytkownika:</p>
        <p>{props.username}</p>
        <p style={paragraphStyle}>Imię i nazwisko:</p>
        <p>{props.first_name} {props.last_name}</p>
        <p style={paragraphStyle}>Adres Email:</p>
        <p>{props.email}</p>
      </div>
    </div>
  );
}
