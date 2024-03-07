from color_model import ColorPredictor
import cv2 as cv
import numpy as np
import urllib.request
import rembg
import pandas as pd

from grouping.n_groups import n_groups

n_groups = n_groups()
IM_HEIGHT, IM_WIDTH = 200, 200

def get_colors(url: str) -> list[list[int]]:
    '''Takes in an image url and returns its predominant color groups in order. Failures will return -1.'''
    # get the image data from the url
    response = urllib.request.urlopen(url)
    img = cv.imdecode(np.asarray(bytearray(response.read())), cv.IMREAD_COLOR)
    response.close()

    # reduce the image size 
    img = cv.resize(img, (IM_HEIGHT, IM_WIDTH))

    # change image to use rgb rather than bgr color space
    img = cv.cvtColor(img, cv.COLOR_BGR2RGB)

    # blur the image
    # img = cv.bilateralFilter(img, 10, 500, 25)

    # remove background
    s = rembg.new_session('u2netp')
    img = rembg.remove(img, session=s, bgcolor=(0,0,0,0))

    # cv.imshow('', img)
    # cv.waitKey()

    # flatten the image rows and columns
    img = np.reshape(img, (IM_HEIGHT*IM_WIDTH, -1))
    # find all pixels where the color alpha value is 0 and remove them
    img = np.delete(img, [i for i in range(IM_HEIGHT*IM_WIDTH) if img[i][3] == 0], axis=0)
    # drop alpha column from colors
    img = img[:, :3]

    # error correction for poor background removal
    if img.size < 20000:
        return -1

    # get color groups from image
    predictor = ColorPredictor()
    labels = predictor.predict(img)

    # count pixels of each color
    votes = [0] * n_groups
    for i in range(len(labels)):
        votes[labels[i]] += 1

    # order groups by pixel count
    prevalent = sorted([[x,i] for i, x in enumerate(votes) if x > 100], reverse=True)
    prevalent_labels = [x[1] for x in prevalent]

    # compress colors, taking only the dominant group for very similar colors
    # for i in range(1,len(prevalent)):
    #     # get hex values of index and previous labels
    #     h0 = predictor.get_center_hex(prevalent_labels[i-1])
    #     h1 = predictor.get_center_hex(prevalent_labels[i])
    #     # convert to rgb tuples
    #     c0 = (int(h0[:2], 16), int(h0[2:4], 16), int(h0[4:], 16))
    #     c1 = (int(h1[:2], 16), int(h1[2:4], 16), int(h1[4:], 16))
        
    #     # calculate cosine similarity between the two colors
    #     cos_sim = np.dot(c0, c1)/(np.linalg.norm(c0) * np.linalg.norm(c1))

    # return just groups
    return prevalent_labels

if __name__ == '__main__':
    # print(get_colors('https://media-photos.depop.com/b1/34570605/1777087976_f762224765eb4cbcb728b9f58ba11978/P0.jpg'))
    # print(get_colors('https://media-photos.depop.com/b1/29235888/1777365855_70ea0ea843e24453abbc993578db119c/P0.jpg'))
    # print(get_colors('https://media-photos.depop.com/b1/44686826/1775473394_0a2ebcb4c0cd413eb05559f51cddbc4e/P0.jpg'))
    print(get_colors('https://media-photos.depop.com/b1/7787383/1783951893_56cb65a6aa574e95a53e58563888a43a/P0.jpg'))
