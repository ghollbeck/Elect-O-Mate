FROM python:3.12

LABEL MAINTAINER="Lorin Urbantat"


WORKDIR /app

COPY main.py /app
COPY requirements.txt /app
COPY cache /app/cache

RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "main.py"]