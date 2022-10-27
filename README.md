# POSENTEGRA

## Posentegra client

## Kurulum
 ## !! [NodeJS İndirip Kurunuz](https://nodejs.org/en/) !!


```php
/tmp/enviroment.json dosyayısını açın
```
```php
Aşağıda örnekteki gibi, SambaPos ayarlarını yapınız. 
//Aşağıda Örnek Verilmiştir.
Kendi Ayarlarınızı girmeniz gerekmektedir.
Entegrasyonun GraphQl bağlantısına ihtiyaç duyar. 
```

```js
{
    "token": "",
    "userId": "",
    "pos": {
        
        "host": "127.0.0.1",
        "port": "9000",
        "name": "İşletme Adı",
        "username": "Entegrasyon",
        "password": "73737373",
        "client_id": "Entegrasyon"
    }
}
```
```php
Bayi Panelinden işletmeye özel TOKEN'ı ilgili satıra boşluksuz gelecek şekilde yazınız.
```

```js
{
    "token": "TOKEN BURAYA YAZILACAK",
    "userId": "",
    "pos": {
        
        "host": "127.0.0.1",
        "port": "9000",
        "name": "İşletme Adı",
        "username": "Entegrasyon",
        "password": "73737373",
        "client_id": "Entegrasyon"
    }
}
```

```php
setup.bat dosyasını çalıştırınız.
```


