# Gestion des Matelas Anti-Escarres (GMAE) -SERVEUR-

## Sommaire

- [Fichier de configuration](#config)

## <a id="config"></a>Fichier de configuration

```js
module.exports = {
	singletonRef: null,
	init: function(env) {
		this.singletonRef = this[env];
		return this.singletonRef;
	},
	get: function() {
		return this.singletonRef;
	},
	development: {
		api_url: '/api/v2',
		root: require('path').normalize(__dirname + '/'),
		app: {
			name: 'Gestion de Matelas Anti Escarres',
			version: '2.0.1d'
		},
		host: 'localhost',
		port: '3000',
		db_prefix: 'mongodb',
		db_port: '27017',
		db_database: 'gmae',
		session_timeout:  1200000, 
		jwt_secret: 'CREATESECRETHASH',
		mailSettings : {
			from: 'abc <abc@foo.bar>',
			smtp: {
				host: '127.0.0.1',
				port: 9025,
				secure: false,
				ignoreTLS : true
			}
		},
		file_directory: "./data",
		ldap : {
			url : 'ldap://192.168.0.1',
			baseDN : 'OU=ABC,DC=FOO,DC=BAR',
			domain : 'foo.bar',
			bindDN : 'CN=Administrator,OU=ABC,DC=FOO,DC=BAR',
			bindCredentials : 'password',
			group : 'Utilisateurs GMAE'
		}
	}
};
```