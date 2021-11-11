import tensorflow_hub as hub
import tensorflow as tf
from matplotlib import pyplot as plt
import numpy as np
import sys
import requests
import uuid
import cv2


def load_image(img_path):
    response = requests.get(img_path)
    img = tf.image.decode_image(response.content, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = img[tf.newaxis, :]

    return img


if __name__ == "__main__":

    model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

    content_path = 'https://ipfs.io/ipfs/'+sys.argv[1]
    style_path = 'https://ipfs.io/ipfs/'+sys.argv[2]

    content_image = load_image(content_path)
    style_image = load_image(style_path)

    stylized_image = model(tf.constant(content_image), tf.constant(style_image))[0]

    path = './public/assets/'
    assetFileName = str(uuid.uuid4().hex)+'.jpg'

    cv2.imwrite(path+assetFileName , cv2.cvtColor(np.squeeze(stylized_image)*255, cv2.COLOR_BGR2RGB))
    
    print(path+assetFileName)

