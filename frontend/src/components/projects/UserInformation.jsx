

export default function UserInformation(){

    const userInfo = {
        username: 'jkowalski',
        first_name: 'Jan',
        last_name: 'Kowalski',
    }

    const paragraphStyle = {
        fontWeight: 'bold'
    }

    return(<>
        <div className="user-information-component">
            <div className="user-image">
                <img src="/static/frontend/userImage.svg" alt="userImage"/>
            </div>
            <div className="user-info">
            <p style={paragraphStyle}>Nazwa użytkownika:</p>
                <p>{userInfo.username}</p>
                    <br/>
                <p style={paragraphStyle}>Imię i nazwisko:</p>
                <p>{userInfo.first_name} {userInfo.last_name}</p>
            </div>
        </div>
    </>)
}