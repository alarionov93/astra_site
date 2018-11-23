# -*- coding: utf-8 -*-
# TODO: CHECK MIGRATION ON A NEW VCS!!
ORDER_STATUS_INITIAL = 1
ORDER_STATUS_CANCELLED = 6

ORDER_NUMBER_LENGTH = 8
# Обрабатывается
# передан производителю
# готов к выдаче
# в процессе доставки
# выполнен
# отменен

# Типы операций в SBRF (почему эти пидоры не передают те же id операции, что и в запросах авторизации и тд ???)
OPERATIONS = {
    'approved': 1,
    'deposited': 2,
    'reversed': 3,
    'refunded': 4
}



# TODO: add to migrations !
# insert into payment_status(value, name, description) values (0, 'Создан', 'Счет к оплате сформирован, вы можете его оплатить.'),
# (1, 'Холдирован', 'Ваши деньги захолдированы. Они будут списаны после того, как мы получим и проверим заказ.'),
# (2, 'Оплачен', 'Мы проверили и взвесили продукты. С вашего счета списана сумма, которая точно соответсвует весу ваших продуктов.'),
# (3, 'Отменен', 'Оплата заказа отменена, свяжитесь с нами для уточнения причин.'),
# (4, 'Возврат', 'Сумма заказа возвращена полностью'),
# (6, 'Отклонен', 'Оплата заказа отклонена, свяжитесь с нами для уточнения причин.');


"""
 id | value |    name    |                                                   description
----+-------+------------+------------------------------------------------------------------------------------------------------------------
  1 |     0 | создан     | Счет к оплате сформирован, вы можете его оплатить.
  4 |     1 | холдирован | Ваши деньги захолдированы. Они будут списаны после того, как мы получим и проверим заказ.
  3 |     2 | оплачен    | Мы проверили и взвесили продукты. С вашего счета списана сумма, которая точно соответсвует весу ваших продуктов.
  5 |     3 | отменен    | Проведение платежа отменено, свяжитесь с нами для уточнения причин
  2 |     4 | возврат    | Выполнен возврат средств на карту клиента
  8 |     6 | отклонен   | Платеж отклонен провайдером, свяжитесь с нами для уточнения причин
"""

PAYMENT_STATUS_INITIAL = 0
PAYMENT_STATUS_HOLDEN = 1
PAYMENT_STATUS_PAID = 2
PAYMENT_STATUS_CANCELLED = 3
PAYMENT_STATUS_REFUNDED = 4
PAYMENT_STATUS_RESET = 6

# FOR PURE SQL QUERIES ON orders TABLE WITH PAYMENT STATUSES IDS
PAYMENT_STATUS_INITIAL_ID = 1
PAYMENT_STATUS_HOLDEN_ID = 4
PAYMENT_STATUS_PAID_ID = 3
PAYMENT_STATUS_CANCELLED_ID = 2
PAYMENT_STATUS_REFUNDED_ID = 5
PAYMENT_STATUS_RESET_ID = 8

USER_TYPE_ADMIN = 1
USER_TYPE_SELLER = 2
USER_TYPE_CUSTOMER = 3

USER_SEX_MALE = 1
USER_SEX_FEMALE = 0

LEGAL_TYPE_CUSTOMER = 0
LEGAL_TYPE_PRIVATE_BUSINESS = 1 # для ИП
# TODO: add others

THUMB_SIZE_HEIGHT = 500
THUMB_SIZE_WIDTH = 500

CERT_THUMB_SIZE_WIDTH = 400
CERT_THUMB_SIZE_HEIGHT = 400

NEWS_THUMB_SIZE_HEIGHT = 100
NEWS_THUMB_SIZE_WIDTH = 100

NEWS_IMG_SIZE_HEIGHT = 400
NEWS_IMG_SIZE_WIDTH = 400

USER_THUMB_SIZE_WIDTH = 300
USER_THUMB_SIZE_HEIGHT = 300

TIME_TO_VOTE = 3600

PRODUCT_DISABLED = 0
PRODUCT_ENABLED = 1


DAYS_RU_SHORT = ('Пн', 'Вт', 'Ср', 'Чт', 'Пт','Сб','Вс')
DAYS_RU_LONG  = ('Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение')

DELIVERY_TYPE_ID_SHOP = 1
DELIVERY_TYPE_ID_HOME = 2

DEFAULT_VALUE = 'default' # value for vars when they should NOT be None
