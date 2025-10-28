from environs import Env

env = Env()
env.read_env()  # read .env file

SECRET_KEY = env.str("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = env.int("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
ALGORITHM = env.str("ALGORITHM", "HS256")