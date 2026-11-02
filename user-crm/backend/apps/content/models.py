from django.db import models
from apps.core.models import TimeStampedModel
class Genre(models.Model): name=models.CharField(max_length=80,unique=True)
class Title(TimeStampedModel):
    class Kind(models.TextChoices): MOVIE="movie","Movie"; SERIES="series","Series"; EPISODE="episode","Episode"
    name=models.CharField(max_length=200,db_index=True)
    kind=models.CharField(max_length=10,choices=Kind.choices,default=Kind.MOVIE)
    language=models.CharField(max_length=40,db_index=True)
    genres=models.ManyToManyField(Genre,related_name="titles",blank=True)
    duration_seconds=models.PositiveIntegerField(default=0)
    release_date=models.DateField(null=True,blank=True)
    is_published=models.BooleanField(default=False,db_index=True)
    class Meta: indexes=[models.Index(fields=["is_published","release_date"])]
    def __str__(self): return self.name
