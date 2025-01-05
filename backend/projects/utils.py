import random
import string
from datetime import datetime


def generate_random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def parse_date(date):
    if isinstance(date, datetime):
        return date.strftime('%d-%m-%Y %H:%M:%S')
    else:
        return date