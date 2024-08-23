from pony.orm import *

db = Database()

### Binding, establecer la conexión con la base de datos.
db.bind(provider='postgres', user='mydb_owner', password='M4ZjNOokxQI0', host='ep-frosty-surf-a5o852lb.us-east-2.aws.neon.tech', database="mydb")

