FROM python:3.12

LABEL MAINTAINER="Lorin Urbantat"
LABEL org.opencontainers.image.source https://github.com/ghollbeck/Elect-O-Mate/


WORKDIR /app

COPY main.py /app
COPY requirements.txt /app
COPY cache /app/cache
COPY Sources /app/Sources

RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "main.py"]