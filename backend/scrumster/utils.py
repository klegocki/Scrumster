import random
import string
from datetime import datetime, timedelta
import pytz


def get_polish_datetime_with_timezone(dt):

    poland_tz = pytz.timezone('Europe/Warsaw')
    dt = dt.replace(tzinfo=poland_tz)

    if dt.dst() != timedelta(0):
        timezone_str = 'CEST'
    else:
        timezone_str = 'CET'

    # Formatowanie datetime z dopiskiem strefy czasowej
    return f'{dt.strftime("%Y-%m-%d %H:%M:%S")} {timezone_str}'


def generate_random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
