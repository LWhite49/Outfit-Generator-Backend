from color_classifier.model import ColorPredictor
import cv2 as cv
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import urllib.request
import rembg
import time

# get the image data from the url
response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/temp/291dabc7cb384d4ab157bfecd69ec027?h=1400&fit=clip&q=20&auto=format')
# response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/temp/fa130eb6d61643b999fed6f5cd43dfef?h=1400&fit=clip&q=20&auto=format')
# response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/47158833/2c4899ca3d8044b19ef3504ea97d3c96?w=1050&h=1400&fit=clip&q=20&auto=format')
# response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/temp/d04aba8a74604d58a0cae9d729706daf?h=1400&fit=clip&q=20&auto=format')
img = cv.imdecode(np.asarray(bytearray(response.read())), cv.IMREAD_COLOR)
response.close()

# reduce the image size 
IM_HEIGHT, IM_WIDTH = 200, 200
img = cv.resize(img, (IM_HEIGHT, IM_WIDTH))
# get the edge image
# edges = cv.Canny(img, 150, 200)

# img = cv.bilateralFilter(img, 10, 200, 30)

# img = img[IM_WIDTH//3:(IM_WIDTH*2)//3, IM_HEIGHT//3:(IM_HEIGHT*2)//3]



# change image to use rgb rather than bgr color space
img = cv.cvtColor(img, cv.COLOR_BGR2RGB)

# remove background
s = rembg.new_session('u2netp')
img = rembg.remove(img, session=s, bgcolor=(0,0,0,0))

cv.imshow('shirt', img)
cv.waitKey()

# flatten the image rows and columns
img = np.reshape(img, (IM_HEIGHT*IM_WIDTH, -1))
# find all pixels where the color alpha value is 0 and remove them
drop = []
for i in range(IM_HEIGHT*IM_WIDTH):
    if img[i][3] == 0:
        drop.append(i)
img = np.delete(img, drop, axis=0)
# drop alpha column from colors
img = img[:, :3]

m = ColorPredictor()
labels = m.predict(img)

votes = [0] * 180
for i in range(len(labels)):
    votes[labels[i]] += 1

prevalent = [i for i, x in enumerate(votes) if x > 50]

print(prevalent)

# print(m.predict(img[0][0]))
# print(img[0][0])

# votes = m.predict(img)
# print(votes)
# for i in range(IM_HEIGHT):
#     for j in range(IM_WIDTH):
#         votes[m.predict(img[i][j])] += 1

# print(votes)
# for color in votes.keys():
#     print(votes[color] / max(votes.values()))
