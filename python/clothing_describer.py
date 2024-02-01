from color_classifier.model import ColorPredictor
import cv2 as cv
import numpy as np
import urllib.request

# get the image data from the url
# response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/temp/291dabc7cb384d4ab157bfecd69ec027?h=1400&fit=clip&q=20&auto=format')
# response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/temp/fa130eb6d61643b999fed6f5cd43dfef?h=1400&fit=clip&q=20&auto=format')
response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/47158833/2c4899ca3d8044b19ef3504ea97d3c96?w=1050&h=1400&fit=clip&q=20&auto=format')
# response = urllib.request.urlopen('https://media-assets.grailed.com/prd/listing/temp/d04aba8a74604d58a0cae9d729706daf?h=1400&fit=clip&q=20&auto=format')
img = cv.imdecode(np.asarray(bytearray(response.read())), cv.IMREAD_COLOR)
response.close()

# reduce the image size 
IM_HEIGHT, IM_WIDTH = 200, 200
img = cv.resize(img, (IM_HEIGHT, IM_WIDTH))
# get the edge image
# edges = cv.Canny(img, 150, 200)

# img = cv.bilateralFilter(img, 10, 200, 30)

img = img[IM_WIDTH//3:(IM_WIDTH*2)//3, IM_HEIGHT//3:(IM_HEIGHT*2)//3]

cv.imshow('shirt', img)
cv.waitKey()

img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
m = ColorPredictor()
# print(m.predict(img[0][0]))
# print(img[0][0])

votes = {'red':0, 'orange':0, 'yellow':0, 'green':0, 'blue':0, 'purple':0, 'pink':0, 'brown':0, 'white':0, 'gray':0, 'black':0}
for i in range(IM_HEIGHT//3):
    for j in range(IM_WIDTH//3):
        votes[m.predict(img[i][j])] += 1

print(votes)
for color in votes.keys():
    print(votes[color] / max(votes.values()))
