FROM ubuntu:xenial

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update \
    && apt-get install -y \
      python-pip \
      python-dev \
      build-essential \
      libffi6 \
      libffi-dev \
      libssl-dev \
      curl \
      bash-completion \
      vim \
      git \
      graphviz \
      libgraphviz-dev \
      pkg-config

RUN pip install --upgrade pip
COPY requirements.txt /requirements.txt
RUN pip install -r requirements.txt

RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -y nodejs

COPY web /web
WORKDIR /web
RUN npm install && npm run dev

COPY orquesta /orquesta
WORKDIR /orquesta
RUN pip install -e .

WORKDIR /web
ENTRYPOINT ["python"]
CMD ["app.py"]
