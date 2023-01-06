def s3_thumbnail_generator(event, context):
    # Get the object from the event and show its content type
    print(f'this was triggered by an s3 event')
    return "this was triggered by an s3 event"