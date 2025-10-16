export const UserPage = (props: { user: any }) => {
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <img
        src={props.user.avatarUrl}
        alt={`Аватар`}
        style={{ width: 150, height: 150, borderRadius: '50%', textAlign: 'center' }}
      />
      <div>
        <h1>{props.user.name}</h1>
        <p>
          <strong>Email:</strong> <a href={`mailto:${props.user.email}`}>{props.user.email}</a>
        </p>
        <p>
          <strong>ID:</strong> {props.user.id}
        </p>
        <p>
          <i>{props.user.bio || 'У пользователя нет биографии.'}</i>
        </p>
      </div>
    </div>
  )
}
