# POSENTEGRA

## Posentegra client

## Kurulum

## !! [NodeJS İndirip Kurunuz](https://nodejs.org/en/) !!

[Posentegra Client İndirmek için tıklayınız. veya sağ üst koşeden Code Bölümünden indirebilirsiniz.](https://github.com/puuble/posentegra/archive/refs/heads/main.zip)

[Github Kurulumu için tıklayınız.](https://git-scm.com/download/win)

```php
/tmp/enviroment.json dosyayısını açın
```

```text
Aşağıda örnekteki gibi, SambaPos ayarlarını yapınız.
//Aşağıda Örnek Verilmiştir.
Kendi Ayarlarınızı girmeniz gerekmektedir.
Entegrasyon GraphQl bağlantısına ihtiyaç duyar.
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

```text
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
